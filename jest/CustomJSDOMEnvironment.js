const JSDOMEnvironment = require('jest-environment-jsdom').default;

class CustomJSDOMEnvironment extends JSDOMEnvironment {
    async setup() {
        await super.setup();
        // Patch innerText on the global window's HTMLElement prototype
        if (this.dom.window.HTMLElement && !('innerText' in this.dom.window.HTMLElement.prototype)) {
            Object.defineProperty(this.dom.window.HTMLElement.prototype, 'innerText', {
                get() {
                    return this.textContent;
                },
                set(text) {
                    this.textContent = text;
                },
            });
        }
    }
}

module.exports = CustomJSDOMEnvironment;
