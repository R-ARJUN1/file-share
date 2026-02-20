import { Wallet,ArrowUpCircle,Shield,Share2,FileText,CreditCard,Clock } from "lucide-react";

const Features=({features})=>{
    const iconMap =(iconName,iconColor)=> {
        const iconProps = {size:23, className: iconColor};
        switch(iconName) {
            case "Wallet":
                return <Wallet {...iconProps} />;
            case "ArrowUpCircle":
                return <ArrowUpCircle {...iconProps} />;
            case "Shield":
                return <Shield {...iconProps} />;
            case "Share2":
                return <Share2 {...iconProps} />;
            case "CreditCard":
                return <CreditCard {...iconProps} />;
            case "FileText":
                return <FileText {...iconProps} />;
            case "Clock":
                return <Clock {...iconProps} />;
            default:
                return <FileText {...iconProps} />;;
        }
    }
    return(
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Everything You need for the File Sharing
                    </h2>
                    <p className="mt-4 text-center max-w-2xl mx-auto text-xl text-gray-500">
                        FileShare Provide all the Tools You need to manage your digital content
                    </p>
                </div>
                <div className="mt-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            // <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            //     <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                            //     <p className="mt-2 text-gray-600">{feature.description}</p>
                            // </div>
                            <div key={index} className="pt-5 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
                                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8" >
                                    <div className="-mt-6">
                                        <div className="inline-flex items-center justify-center p-3 bg-white shadow-lg rounded-md"> 
                                            {iconMap(feature.iconName,feature.iconColor)}
                                        </div>
                                        <h3 className="mt-5 text-lg font-medium text-gray-900 tracking-tight">{feature.title}</h3>
                                        <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Features;