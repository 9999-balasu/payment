import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import { useState } from "react";
import toast, {Toaster} from "react-hot-toast"

export default function ProductCard() {
    const [amount, setamount ] = useState(350);

    const handlePayment = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/order`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    amount
                })
            });

            const data = await res.json();
            console.log(data);
            handlePaymentVerify(data.data)
        } catch (error) {
            console.log(error);
        }
    }


    // handlePaymentVerify Function
    const handlePaymentVerify = async (data) => {
        const options = {
            key: import.meta.env.RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: "Yokshitha",
            description: "Test Mode",
            order_id: data.id,
            handler: async (response) => {
                console.log("response", response)
                try {
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/verify`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })
                    })

                    const verifyData = await res.json();

                    if (verifyData.message) {
                        toast.success(verifyData.message)
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#5f63b8"
            }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    }
    return (
        <Card className="mt-6 w-64 bg-[#222f3e] text-white">
            {/* CardHeader */}
            <CardHeader className="relative h-36 bg-[#2C3A47] overflow-hidden">
            <h1>Yok Dresses</h1>

                {/* Image  */}
                <img
                    className="w-75 h-75 object-contain mx-auto" // Adjust the size here
                   

                    src="https://tse3.mm.bing.net/th?id=OIP.bRR_yM9qL76g8BNzW3xNJAHaHa&pid=Api&P=0&h=180"
                    alt="card-image"
                />
            </CardHeader>

            {/* CardBody */}
            <CardBody>
                {/* Typography for Title */}
                <Typography variant="h5" className="mb-2 font-semibold">
                    My First Product
                </Typography>

                {/* Typography for Price */}
                {/*<Typography className="text-lg">
                    ₹350 <span className="text-gray-500 line-through">₹699</span>
                </Typography>*/}

<Typography className="text-lg">
    ₹350 <span className="text-gray-500 line-through">₹699</span>
</Typography>
            </CardBody>

            {/* CardFooter */}
            <CardFooter className="pt-0">
                {/* Buy Now Button */}
                <Button onClick={handlePayment} className="w-full bg-[#1B9CFC] hover:bg-[#1A8CC8]">
                    Buy Now
                </Button>
                <Toaster/>
            </CardFooter>
        </Card>
    );
}
