
export const BlobTransformBase64 = (blob: Blob):Promise<string> => new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onload = () => {
        resolve(reader.result as string)
    }
})
