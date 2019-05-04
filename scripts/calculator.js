const numberButtons = document.querySelectorAll("#buttons-container .number");
const operatorButtons = document.querySelectorAll("#buttons-container .operator");
const display = document.querySelector("#display .result");
const resultButton = document.querySelector("#buttons-container .equal");
const clearButton = document.querySelector("#buttons-container .clear");
var value = 0;
const inputState = {
    waitingForValue: 1, //can't input an operator
    waitingForOperator: 2 //cant input an operator
}
const operatorPrecedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2
}
var displayState = inputState.waitingForValue;
var expression = [];
var valueStack = [];



display.textContent = "0";


numberButtons.forEach( button => button.addEventListener("click",createOperand));
operatorButtons.forEach( button => button.addEventListener("click",addElementToExpression));
resultButton.addEventListener("click",displayResult);
clearButton.addEventListener("click",clear);


function displayResult(){

    let result;
    let postFixExpression;

    if(displayState == inputState.waitingForOperator){

        expression.push(value);
        console.log(expression);
        postFixExpression = convertToPostfix(expression);
        console.log("postfix = ",postFixExpression);
        result = evaluatePostfix(postFixExpression);
        value = result;
        console.log("result = ",result);
        display.textContent = result;
    }

}
function evaluatePostfix(expresion){

    let currentToken;
    let valueStack = [];

    while(expresion.length != 0){

        currentToken = expresion[0];
        expresion.shift();

        if(typeof currentToken == "number"){
            valueStack.push(currentToken);

        //currentToken is an operator
        }else{

            let operand1 = valueStack.pop();
            let operand2 = valueStack.pop();
            let result = operate(currentToken,operand1,operand2);
            valueStack.push(result);
        }
    }
    //the final result is top of the valueStack
    return valueStack.pop();
}



function convertToPostfix(infixExpression){

    let currentToken;
    let operatorStack = [];
    let postfixExpression = [];
    let fromOperatorStack;

    while(infixExpression.length != 0){
       
        currentToken = infixExpression[0];
        infixExpression.shift();

        if(typeof currentToken == "number"){
            postfixExpression.push(currentToken);
        
        //currentToken is an operator
        }else{     

            while(operatorStack.length != 0){

                fromOperatorStack = operatorStack.pop();

                if(operatorPrecedence[fromOperatorStack] >= operatorPrecedence[currentToken]){
                    postfixExpression.push(fromOperatorStack);

                }else{
                    operatorStack.push(fromOperatorStack);
                    operatorStack.push(currentToken);
                    break;
                }
            }
            //all elements removed from operatorStack 
            if(operatorStack.length == 0){
                operatorStack.push(currentToken);
            }
        }
    }
    //infix is empty , remove all remaining operators from stack
    while(operatorStack != 0){
        fromOperatorStack = operatorStack.pop();
        postfixExpression.push(fromOperatorStack);
    }

    return postfixExpression;
}




function createOperand(){

    displayState = inputState.waitingForOperator;

    if(display.textContent == "0"){
        display.textContent = this.getAttribute("data-value");
    }else{
        display.textContent += this.getAttribute("data-value");
    }
    value = +display.textContent;
}

function addElementToExpression(){

    if(displayState == inputState.waitingForOperator){
        let operator = this.getAttribute("data-operator");

        expression.push(value);
        expression.push(operator);
        
        clear();
        console.log(expression);

    }else if(displayState == inputState.waitingForValue){
        return;
    }
}


function operate(operator,number1,number2){
    let result;

    if(operator == "+"){
        result = number2 + number1;
    }else if(operator == "-"){
        result = number2 - number1;
    }else if(operator == "*"){
        result = number2*number1;
    }else if(operator == "/"){
        result = number2/number1;
    }

    return result;
}

function clear(){

    display.textContent = "0";
    value = 0;
    displayState = inputState.waitingForValue;

}