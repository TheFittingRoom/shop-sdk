export const showHideElement = (condition: any, element) => {
    if (element) {
        if (condition) {
            element.removeAttribute("data-tfr");
        } else {
            element.setAttribute("data-tfr", "hidden");
        }
    }
}