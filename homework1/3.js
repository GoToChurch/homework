/*
Создать класс данных “Товар”
С полями
Название
Цена
Количество
Описание
Наполнить массив объектами такого класса.
Написать метод, который получает строку вида
“name-contains-fd&price-=2-&quantity->5&description-ends-abc”
“name-starts-fd&quantity=5”
На выходе возвращает массив, только с подходящими объектами
возможны (contains, starts, ends для строковых и <, =, >, <=, >= для числовых)
 */

class Product {
    constructor(name, price, quantity, description) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.description = description;
    }
}

let products = [
    new Product("product1", 5, 5, "The first product"),
    new Product("Milk", 3, 10, "Milky the milk"),
    new Product("The ball", 7, 2, "Football ball"),
]

function filterProducts(str) {
    let filteredProducts = [];

    let splitedStr = splitFilterString(str);

    for (let product of products) {
        let isAppropriate = false;

        for (let string of splitedStr) {
            if (isFinite(string[2])) {
                let productPropertyNumber = product[string[0]];
                let stringPropertyNumber = string[2];

                switch (string[1]) {
                    case "<":
                        isAppropriate = (productPropertyNumber < stringPropertyNumber);
                        break;
                    case "=":
                        isAppropriate = (productPropertyNumber = stringPropertyNumber);
                        break;
                    case ">":
                        isAppropriate = (productPropertyNumber > stringPropertyNumber);
                        break;
                    case "<=":
                        isAppropriate = (productPropertyNumber <= stringPropertyNumber);
                        break;
                    case ">=":
                        isAppropriate = (productPropertyNumber >= stringPropertyNumber);
                        break;
                }

                if (!isAppropriate) {
                    break
                }
            }
            else {
                let productPropertyValue = product[string[0]];
                let stringPropertyValue = string[2];

                switch (string[1]) {
                    case "contains":
                        isAppropriate = productPropertyValue.includes(stringPropertyValue);
                        break;
                    case "starts":
                        isAppropriate = productPropertyValue.startsWith(stringPropertyValue);
                        break;
                    case "ends":
                        isAppropriate = productPropertyValue.endsWith(stringPropertyValue);
                        break;
                }
            }
        }

        if (isAppropriate) {
            filteredProducts.push(product)
        }
    }

    return filteredProducts;
}

function splitFilterString(str) {
    let splitedStr = str
        .split("&")
        .map(item => item.split("-").filter(prop => prop.length > 0));

    for (let property of splitedStr) {
        if (property.length < 3) {
            property[2] = property[1].slice(-1);
            property[1] = property[1].slice(0, -1);
        }
    }

    return splitedStr;
}

console.log(filterProducts("quantity->=5&description-ends-ct"));