import { format } from "date-fns"

export const FULL_DATE_STRING_KEYWORD = 'yyyy-MM-dd HH:mm:ss'
export const getCurrentFullDateString = () => format(new Date(), FULL_DATE_STRING_KEYWORD)