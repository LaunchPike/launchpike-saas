const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || '';

export default function setImage(url: string) {
    return `${PUBLIC_BASE_URL}/${url}`
}