import Heros from "../components/landing/Heros";
import Features from "../components/landing/Features";
import Pricing from "../components/landing/Pricing";
import Feedback from "../components/landing/Feedback";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";
import {features,pricingPlans} from "../assets/data";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {useEffect } from "react";

const Landing=() =>{
    const{ openSignIn, openSignUp}= useClerk();
    const{isSignedIn} =useUser();
    const navigate= useNavigate();

    useEffect(
        ()=>{
            if(isSignedIn){
                navigate("/dashboard");
            }
        }, [isSignedIn,navigate]

    );
    return (
        <div className="landing-page bg-gradient-to-b from-gray-50 to-gray-100">

            {/* Hero Section */ }
            <Heros openSignIn={openSignIn} openSignUp = {openSignUp}/>
            {/* Features Section */ }
            <Features features={features} />    
            {/* Price Section */ }
            <Pricing pricingPlans={pricingPlans} openSignUp = {openSignUp} />
            {/* Testimonials Section */ }
            <Feedback />
            {/* CTA Section */ }
            <CTA openSignUp={openSignUp}/>
            {/* Footer Section */ }
            <Footer />


        </div>
    )
}
export default Landing;