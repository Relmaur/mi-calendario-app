export default {
    bind: function (element, binding, vnode) {
        element.clickOutsideEvent = function (event) {

            /* Check if the click was outside of the element and his children */
            if (!(element == event.target || element.contains(event.target)) && event.target.contains(element)) {
                /* If it did, call the method provided in the attribute value */
                vnode.context[binding.expression](event);
            }
        };
        document.body.addEventListener('click', element.clickOutsideEvent);
    },
    unbind: function (element) {
        document.body.removeEventListener('click', element.clickOutsideEvent);
    }
};