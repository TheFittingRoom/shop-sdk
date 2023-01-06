export const showHideElement = (condition: any, element) => {
    if (element) {
        if (condition) {
            element.removeAttribute("data-tfr");

            const event = new Event('TheFittingRoomUser');
            // Dispatch the event.
            window.dispatchEvent(event);
        } else {
            element.setAttribute("data-tfr", "hidden");
        }
    }
}