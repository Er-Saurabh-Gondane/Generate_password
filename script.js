const inputSlider = document.querySelector("[data-lengthSlider]");
const displayLengt = document.querySelector("[data-lenghtNumber]");

const displayPassword = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg =document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#upperCase");
const lowerCaseCheck = document.querySelector("#lowerCase");
const numebersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/' ;

// intially
let password ="";
let passwordLengt = 10;
let checkCount = 0;

handleSlider();

function handleSlider(){
    inputSlider.value = passwordLengt;
    displayLengt.innerText = passwordLengt;


    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLengt - min)*100/(max - min)) + "% 100%"
}


inputSlider.addEventListener('input',(e)=>{
    passwordLengt = e.target.value;
    handleSlider();
})

// generating random sym uppercases lowercases numbers

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateRadomNumber(){
    return getRndInteger(0,9);
}
function generateSymbol(){
    const randNum = getRndInteger(0 , symbols.length);
    return symbols.charAt(randNum); 
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSym = false;

    if(upperCaseCheck.checked) hasUpper = true;
    if(lowerCaseCheck.checked) hasLower = true;
    if(numebersCheck.checked) hasNumber =true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower &&(hasNumber || hasSym)&&  passwordLengt>=8){
        setIndicator("#0f0");
    }
    else if((hasUpper && hasLower) || (hasNumber && hasSym) && passwordLengt>=6 ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
        
    });

    // special case
    if(passwordLengt < checkCount){
        passwordLengt = checkCount;
        handleSlider();
    }

}

allCheckBox.forEach( (checkbox) => {    
    checkbox.addEventListener('change' ,handleCheckBoxChange);
});

async function copyContent(){
    try{
        await navigator.clipboard.writeText(displayPassword.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }

    // to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000)
}

copyBtn.addEventListener('click' ,()=>{
    if(displayPassword.value){
        copyContent();
    }
})
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCount == 0) 
        return;

    if(passwordLengt < checkCount) {
        passwordLengt = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(upperCaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowerCaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numebersCheck.checked)
        funcArr.push(generateRadomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLengt-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    displayPassword.value = password;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});
