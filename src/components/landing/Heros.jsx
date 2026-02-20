// import dashboard from '../../assets/dashboard.png'
import {assets} from '../../assets/assets'
const Heros=({openSignIn,openSignUp})=>{
    return(
        <div className="landing-page-content relative">
        
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 z-0 pointer-events-none">

        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
                <div className="text-center">
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        <span className="block">Share Files Easily with</span>
                        <span className="block text-purple-600">FileShare</span>
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Upload, manage and share files seamlessly with FileShare.
                    </p>
                    <div className="mt-10 max-w-md mx-auto sm:max-w-none sm:flex sm:justify-center">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center">
                            <button onClick={()=>openSignUp()}
                            className="px-8 py-3 md:px-10 md:py-4 text-base md:text-lg font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                Get Started
                            </button>
                            <button onClick= { () => openSignIn() }
                            className="px-8 py-3 md:px-10 md:py-4 text-base md:text-lg font-semibold rounded-lg text-purple-600 bg-white border-2 border-purple-600 hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="aspect-w-16 rounded-lg shadow-xl overflow-hidden">
                    <img src={assets.dashboard} alt="Fileshare dashboard" className="w-full h-full object-cover"></img>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black opacity-10 rounded-lg">

                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="mt-4 text-base text-gray-500">all your files are encrypted and stored with Enterprise level securit Protocols in FileShare</p>
            </div>
        </div>

        </div>
    )
}
export default Heros;