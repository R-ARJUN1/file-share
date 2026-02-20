
const CTA=({openSignUp})=>{
    return(
        <div className="bg-purple-500">
         <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:items-center lg:justify-between">
            <h2 className="font-extrabold tracking-tight text-white sm:text-4xl text-3xl ">
                <span className="block">Ready to get Started?</span>
                <span className="block  text-purple-100"> Create Your account Today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="rounded-md inline shadow">
                    <button onClick= { () => openSignUp() }
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50 transition-colors duration-150">
                        Sign Up for Free!
                    </button>
                </div>
            </div>
         </div>
        </div>
    )
}   
export default CTA;