// Main file
async function runTests(){
    console.log("This is the main function of test.js!");

    const add = (a, b) => a + b;


    // Test 1: Should pass
    try{
        const result = add(2, 2);
        if (result !== 4) throw 'Test failed for 2 + 2 = 4';

        console.log("Happy path passed!");
    }catch (e){
        console.log("Happy path failed:", e);
    }

    // Test 2: Should fail
    try{
        const result = add(2, 3);
        if (result !== 4) throw 'Test failed for 2 + 2 = 4';

        console.log("FAILED: Negative path unexpectedly passed");
    }catch (e){
        console.log("Negative path correctly failed:", e);
    }

}

runTests();