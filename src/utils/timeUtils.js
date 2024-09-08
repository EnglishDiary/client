import { date } from 'quasar'

const timeUtils = {
    formatDate: (dateString) => {
        const now = new Date()
        const created = new Date(dateString)
        const diffInHours = (now - created) / (1000 * 60 * 60)

        if (diffInHours < 24) {
            // 24시간 이내
            if (diffInHours < 1) {
                return '방금 전'
            } else {
                return `${Math.floor(diffInHours)}시간 전`
            }
        } else {
            // 24시간 이후
            return date.formatDate(created, 'YYYY. MM. DD.')
        }
    }
}

export { timeUtils }