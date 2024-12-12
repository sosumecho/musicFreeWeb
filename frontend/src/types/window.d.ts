/** 某些没有类型的新特性 */
interface Window {
    /** 获取本地字体 */
    queryLocalFonts: () => Promise<FontData[]>
}


declare interface FontData {
    family: string;
    fullName: string;
    postscriptName: string;
    style: string;
}
