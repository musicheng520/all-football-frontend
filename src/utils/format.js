export const formatTime = (arr) => {
    if (!arr || arr.length < 6) return "";

    const [y, m, d, h, min] = arr;

    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")} ${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
};