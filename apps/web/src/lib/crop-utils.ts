export type CropShapeKey = "rect" | "circle" | "triangle" | "star" | "heart" | "diamond" | "hexagon" | "pentagon"

export async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

/**
 * Apply a shape mask onto an existing canvas using destination-in compositing.
 * Pixels outside the shape become transparent.
 */
function applyShapeMask(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  shape: CropShapeKey,
) {
  if (shape === "rect") return // no mask needed

  ctx.save()
  ctx.globalCompositeOperation = "destination-in"
  ctx.beginPath()

  const cx = w / 2
  const cy = h / 2

  switch (shape) {
    case "circle": {
      const r = Math.min(w, h) / 2
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      break
    }
    case "triangle": {
      ctx.moveTo(cx, 0)
      ctx.lineTo(w, h)
      ctx.lineTo(0, h)
      ctx.closePath()
      break
    }
    case "diamond": {
      ctx.moveTo(cx, 0)
      ctx.lineTo(w, cy)
      ctx.lineTo(cx, h)
      ctx.lineTo(0, cy)
      ctx.closePath()
      break
    }
    case "hexagon": {
      const r = Math.min(w, h) / 2
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      break
    }
    case "pentagon": {
      const r = Math.min(w, h) / 2
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i - Math.PI / 2
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      break
    }
    case "star": {
      const outerR = Math.min(w, h) / 2
      const innerR = outerR * 0.42
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 5) * i - Math.PI / 2
        const r = i % 2 === 0 ? outerR : innerR
        const x = cx + r * Math.cos(angle)
        const y = cy + r * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      break
    }
    case "heart": {
      // Scale so heart fits neatly within w×h
      const s = Math.min(w, h)
      const ox = (w - s) / 2
      const oy = (h - s) / 2
      ctx.moveTo(ox + s * 0.5, oy + s * 0.3)
      ctx.bezierCurveTo(ox + s * 0.5, oy + s * 0.08, ox + s * 0.08, oy + s * 0.08, ox + s * 0.08, oy + s * 0.42)
      ctx.bezierCurveTo(ox + s * 0.08, oy + s * 0.72, ox + s * 0.5, oy + s * 0.88, ox + s * 0.5, oy + s)
      ctx.bezierCurveTo(ox + s * 0.5, oy + s * 0.88, ox + s * 0.92, oy + s * 0.72, ox + s * 0.92, oy + s * 0.42)
      ctx.bezierCurveTo(ox + s * 0.92, oy + s * 0.08, ox + s * 0.5, oy + s * 0.08, ox + s * 0.5, oy + s * 0.3)
      ctx.closePath()
      break
    }
  }

  ctx.fillStyle = "#000"
  ctx.fill()
  ctx.restore()
}

export async function getCroppedImage({
  imageSrc,
  croppedAreaPixels,
  rotation = 0,
  format = "image/png",
  quality = 1,
  shape = "rect",
}: {
  imageSrc: string
  croppedAreaPixels: {
    x: number
    y: number
    width: number
    height: number
  }
  rotation?: number
  format?: string
  quality?: number
  shape?: CropShapeKey
}): Promise<Blob> {
  const image = await createImage(imageSrc)

  // ── Step 1: draw the full rotated image onto a bounding-box-sized canvas ──
  const radians = (rotation * Math.PI) / 180
  const sin = Math.abs(Math.sin(radians))
  const cos = Math.abs(Math.cos(radians))

  const bBoxWidth = Math.round(image.width * cos + image.height * sin)
  const bBoxHeight = Math.round(image.width * sin + image.height * cos)

  const rotCanvas = document.createElement("canvas")
  rotCanvas.width = bBoxWidth
  rotCanvas.height = bBoxHeight

  const rotCtx = rotCanvas.getContext("2d")
  if (!rotCtx) throw new Error("Canvas context not available")

  rotCtx.translate(bBoxWidth / 2, bBoxHeight / 2)
  rotCtx.rotate(radians)
  rotCtx.translate(-image.width / 2, -image.height / 2)
  rotCtx.drawImage(image, 0, 0)

  // ── Step 2: extract the crop region ──
  const cropX = Math.round(croppedAreaPixels.x)
  const cropY = Math.round(croppedAreaPixels.y)
  const cropW = Math.round(croppedAreaPixels.width)
  const cropH = Math.round(croppedAreaPixels.height)

  const imageData = rotCtx.getImageData(cropX, cropY, cropW, cropH)

  // ── Step 3: paint onto final canvas ──
  const outCanvas = document.createElement("canvas")
  outCanvas.width = cropW
  outCanvas.height = cropH

  const outCtx = outCanvas.getContext("2d")
  if (!outCtx) throw new Error("Canvas context not available")
  outCtx.putImageData(imageData, 0, 0)

  // ── Step 4: apply shape mask if not rect ──
  if (shape && shape !== "rect") {
    applyShapeMask(outCtx, cropW, cropH, shape)
  }

  // For non-rect shapes on JPEG, the transparency becomes black — force PNG
  const outputFormat = shape !== "rect" && format === "image/jpeg" ? "image/png" : format

  return new Promise((resolve, reject) => {
    outCanvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Failed to create blob from canvas"))
      },
      outputFormat,
      outputFormat === "image/png" ? undefined : quality
    )
  })
}

/** Revoke all object URLs created from a list of src strings */
export function revokeObjectURLs(urls: string[]) {
  urls.forEach((url) => {
    if (url.startsWith("blob:")) {
      URL.revokeObjectURL(url)
    }
  })
}
