import React from 'react';

const brands = [
    { name: 'CATERPILLAR', logo: 'https://www.vectorlogo.zone/logos/caterpillar/caterpillar-ar21.svg' },
    { name: 'JCB', logo: 'https://www.vectorlogo.zone/logos/jcb/jcb-ar21.svg' },
    { name: 'PERKINS', logo: 'https://www.vectorlogo.zone/logos/perkins/perkins-ar21.svg' },
    { name: 'CUMMINS', logo: 'https://www.vectorlogo.zone/logos/cummins/cummins-ar21.svg' },
    { name: 'KMP', logo: 'https://www.vectorlogo.zone/logos/kmparts/kmparts-ar21.svg' },
    { name: 'CATERPILLAR', logo: 'https://www.vectorlogo.zone/logos/caterpillar/caterpillar-ar21.svg' },
    { name: 'JCB', logo: 'https://www.vectorlogo.zone/logos/jcb/jcb-ar21.svg' },
    { name: 'PERKINS', logo: 'https://www.vectorlogo.zone/logos/perkins/perkins-ar21.svg' },
    { name: 'CUMMINS', logo: 'https://www.vectorlogo.zone/logos/cummins/cummins-ar21.svg' },
    { name: 'KMP', logo: 'https://www.vectorlogo.zone/logos/kmparts/kmparts-ar21.svg' },
];

export const BrandsMarquee: React.FC = () => {
    return (
        <div className="py-6 md:py-8 bg-gray-800 overflow-hidden border-y border-gray-700">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center">
                    Saudi Horizon - Your Trusted Partner for Heavy Equipment Parts
                </h2>
            </div>

            <div className="relative w-full overflow-hidden">
                <style>
                    {`
                        @keyframes scroll {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        .marquee-container:hover .marquee-content {
                            animation-play-state: paused;
                        }
                        .marquee-content {
                            animation: scroll 40s linear infinite;
                        }
                        @media (max-width: 640px) {
                            .marquee-content {
                                animation-duration: 60s;
                            }
                        }
                    `}
                </style>
                <div className="marquee-container w-full">
                    <div className="marquee-content flex w-max">
                        {brands.map((brand, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-center mx-2 md:mx-4 px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl bg-gray-700/50 backdrop-blur-sm border border-gray-600 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer min-w-[140px] md:min-w-[160px]"
                            >
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-h-12 md:max-h-16 max-w-full object-contain"
                                />
                            </div>
                        ))}
                        {/* Duplicate for seamless loop */}
                        {brands.map((brand, index) => (
                            <div
                                key={`dup-${index}`}
                                className="flex items-center justify-center mx-2 md:mx-4 px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl bg-gray-700/50 backdrop-blur-sm border border-gray-600 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer min-w-[140px] md:min-w-[160px]"
                            >
                                <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="max-h-12 md:max-h-16 max-w-full object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
