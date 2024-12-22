import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import 'dayjs/locale/tr'

dayjs.locale('tr')
dayjs.extend(utc)

export { dayjs }
