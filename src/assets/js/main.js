const curTheme = localStorage.getItem("data-theme");

if (curTheme) {
    document.documentElement.setAttribute("data-theme", curTheme);
} else {
    document.documentElement.setAttribute("data-theme", "light");
}

const btnDarkMode = document.querySelectorAll(".dark-mode button");

const clearActive = () => {
    btnDarkMode.forEach((btn) => {
        if (btn.classList.contains("active")) {
            btn.classList.remove("active");
        }
    });
};

window.onload = () => {
    const curTheme = document.documentElement.getAttribute("data-theme");
    if (curTheme === "light") {
        document.querySelector("button.light").classList.add("active");
    } else {
        document.querySelector("button.dark").classList.add("active");
    }
};

Array.from(btnDarkMode).forEach(function (btn) {
    btn.addEventListener("click", function () {
        clearActive();
        this.classList.add("active");
        if (btn.classList.contains("light")) {
            localStorage.setItem("data-theme", "light");
            document.documentElement.setAttribute("data-theme", "light");
        } else {
            localStorage.setItem("data-theme", "dark");
            document.documentElement.setAttribute("data-theme", "dark");
        }
    });
});

const model = {
    buttons: [],
};

const view = {
    render() {
        model.buttons.forEach((button) => {
            document.querySelector(".button-wrap").appendChild(button);
        });
    },
};

const controller = {
    init() {
        this.generateButton();
        view.render();
    },
    createButton(text, value, type) {
        const button = document.createElement("button");
        button.value = value;
        button.innerText = text;
        if (type) {
            button.className = type;
        }

        switch (value) {
            case "AC":
            case "DEL":
            case "%":
                button.className += " blue";
                break;
            case "÷":
            case "+":
            case "-":
            case "x":
            case "=":
                button.className += " red";
                break;
            default:
        }

        button.addEventListener("click", () => {
            const output = document.querySelector(".output .current-operand");
            if (button.classList.contains("evaluate")) {
                let result = this.evaluateOperand(output.innerText);
                if (result && result.toString().length >= 10) {
                    result = Number.parseFloat(result)?.toPrecision(11);
                }
                output.innerText = result;
            } else if (button.classList.contains("clear")) {
                this.clearAll();
            } else if (button.classList.contains("delete")) {
                this.delete();
            } else {
                output.innerText += button.value;
            }
        });

        return button;
    },
    generateButton() {
        let button;

        button = this.createButton("AC", "AC", "clear");
        model.buttons.push(button);
        button = this.createButton("DEL", "DEL", "delete");
        model.buttons.push(button);
        button = this.createButton("%", "%");
        model.buttons.push(button);
        button = this.createButton("÷", "÷");
        model.buttons.push(button);
        for (let i = 9; i >= 0; i--) {
            switch (i) {
                case 6:
                    button = this.createButton("x", "x");
                    model.buttons.push(button);
                    i = 6;
                    break;
                case 3:
                    button = this.createButton("-", "-");
                    model.buttons.push(button);
                    i = 3;
                    break;
                case 0:
                    button = this.createButton("+", "+");
                    model.buttons.push(button);
                    i = 0;
                    break;
                default:
                    break;
            }
            button = this.createButton(i, i);
            model.buttons.push(button);
        }
        button = this.createButton(".", ".");
        model.buttons.push(button);
        button = this.createButton("=", "=", "evaluate");
        model.buttons.push(button);
    },
    evaluateOperand(operand) {
        if (operand.indexOf("÷") !== -1 && operand.indexOf("x") !== -1) {
            operand = operand.replace("÷", "/");
            operand = operand.replace("x", "*");
        } else if (operand.indexOf("x") !== -1) {
            operand = operand.replace("x", "*");
        } else if (operand.indexOf("÷") !== -1) {
            operand = operand.replace("÷", "/");
        }
        try {
            return eval(operand);
        } catch (error) {
            return "Math ERROR";
        }
    },
    clearAll() {
        document.querySelector(".output .current-operand").innerText = "";
    },
    delete() {
        let output = document.querySelector(".output .current-operand");
        let text = output.innerText;
        text = text.slice(0, -1);
        output.innerText = text;
    },
};

controller.init();
