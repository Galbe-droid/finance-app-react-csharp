export function mapFormatDate(dateIso?: string | null) {
    if(!dateIso) return "-";

    return new Date(dateIso).toLocaleDateString("pt-br", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
} 