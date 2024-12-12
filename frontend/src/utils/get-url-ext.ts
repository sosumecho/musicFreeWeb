export default function getUrlExt(url?: string) {
    if (!url) {
        return;
    }
    const urlObj = new URL(url);
    const ext = extname(urlObj.pathname);
    return ext;
}

function extname(path: string) {
    // 查找最后一个 '.' 的位置
    const dotIndex = path.lastIndexOf('.');
    // 查找最后一个 '/' 的位置
    const slashIndex = path.lastIndexOf('/');

    // 如果 '.' 在 '/' 之后，并且存在 '.', 则返回从 '.' 开始的子字符串
    if (dotIndex > slashIndex && dotIndex !== -1) {
        return path.substring(dotIndex);
    }
    // 否则返回空字符串
    return '';
}
