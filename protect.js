/*
 * Website Credit Protection Script for Csm Mohasin Alam
 */

// এনক্রিপ্টেড ভ্যালুগুলি (Base64)
const _var1 = 'RGV2ZWxvcGVkIGJ5IENzbSBNb2hhc2luIEFsYW0=';  // "Developed by Csm Mohasin Alam"
const _var2 = 'aHR0cHM6Ly9jc20tbW9oYXNpbi5naXRodWIuaW8=';   // "https://csm-mohasin.github.io"
const _var3 = 'ZGV2LWNyZWRpdC1saW5r';                           // "dev-credit-link" 

// Base64 ডিকোড করার ফাংশন
function decodeBase64(encoded) {
    return atob(encoded); 
}

// মূল সুরক্ষা ফাংশন
function runSecurityCheck() {
    const requiredText = decodeBase64(_var1);
    const originalURL = decodeBase64(_var2);
    const elementID = decodeBase64(_var3);

    const creditElement = document.getElementById(elementID);
    
    let isStolen = false;

    // ক্রেডিট চেক
    if (!creditElement || creditElement.textContent.trim() !== requiredText || creditElement.href !== originalURL) {
        isStolen = true;
    }

    // যদি চুরি হয়, তবে রিডাইরেক্ট করা
    if (isStolen) {
        window.location.replace(originalURL);
        while(true) {} // নিশ্চিত করার জন্য লুপ
    }
}

window.onload = runSecurityCheck;
