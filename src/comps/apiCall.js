export const getClientToken=async ()=>{

    try {
        const response = await fetch('http://localhost:5000/api/generate/token', {
            method: 'GET',
            headers: {
                "Content-type": "application/json"
            }
        })
        return await response.json()
    } catch (err) {
        return console.log(err)
    }
}

export const makePayment=async (data)=>{
    try {
        const response = await fetch('http://localhost:5000/api/process/payment', {
            method: "POST",
            headers: {
                "Content-type": 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(data)
        })
        return await response.json()
    } catch (err) {
        return console.log(err)
    }
}