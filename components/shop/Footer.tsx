import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#303846] text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl mb-4">Pages</h3>
                        <ul className="space-y-2">
                            <li><a href="https://electriummobility.com/about"
                                   className="font-extralight hover:text-green-600 hover:underline transition ease-in-out duration-300">About</a>
                            </li>
                            <li><a href="https://electriummobility.com/team"
                                   className="font-extralight hover:text-green-600 hover:underline transition ease-in-out duration-300">Team</a>
                            </li>
                            <li><a href="https://electriummobility.com/contact"
                                   className="font-extralight hover:text-green-600 hover:underline transition ease-in-out duration-300">Contact</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl mb-4">Recent Projects</h3>
                        <ul className="space-y-2">
                            <li><a href="https://electriummobility.com/docs/W2024-projects/project1_2023"
                                   className="font-extralight hover:text-green-600 hover:underline transition ease-in-out duration-300">Electric Bike</a>
                            </li>
                            <li><a href="https://electriummobility.com/docs/W2024-projects/project2_2023"
                                   className="font-extralight hover:text-green-600 hover:underline transition ease-in-out duration-300">Electric Skateboard</a>
                            </li>
                            <li><a href="https://electriummobility.com/docs/W2024-projects/project3_2023"
                                   className="font-extralight hover:text-green-600 hover:underline transition ease-in-out duration-300">OneWheel</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl mb-4">Get Involved</h3>
                        <ul className="space-y-2">
                            <li><a href="https://electriummobility.com/join-our-team"
                                   className="font-extralight hover:text-green-600 hover:underline transition ease-in-out duration-300">Join Our Team</a>
                            </li>
                            <li><a href="https://electriummobility.com/sponsors"
                                   className="font-extralight hover:text-green-600 hover:underline transition ease-in-out duration-300">Become A Sponsor</a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl mb-4">Community</h3>
                        <ul className="space-y-2">
                            <li><a
                                href="https://imodules.uwaterloo.ca/s/1802/21/form.aspx?sid=1802&gid=2&pgid=1266&cid=3030&bledit=1&dids=296"
                                className="font-extralight hover:text-green-600 hover:underline transition ease-in-out duration-300">Support
                                Us</a>
                            </li>
                            <li><a href="https://www.youtube.com/@electriummobility"
                                   className="font-extralight hover:text-green-600 hover:underline transition ease-in-out duration-300">YouTube</a>
                            </li>
                            <li><a href="https://www.instagram.com/electriummobility/"
                                   className="font-extralight hover:text-green-600 hover:underline transition ease-in-out duration-300">Instagram</a>
                            </li>
                            <li><a href="https://discord.com/invite/jggFVza4XR"
                                   className="font-extralight hover:text-green-600 hover:underline transition ease-in-out duration-300">Discord</a>
                            </li>
                            <li><a href="https://www.linkedin.com/company/electrium-mobility/"
                                   className="font-extralight hover:text-green-600 hover:underline transition ease-in-out duration-300">LinkedIn</a>
                            </li>
                            <li><a href="mailto:electriummobility@gmail.com"
                                   className="font-extralight hover:text-green-600 hover:underline transition ease-in-out duration-300">Email</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <a href="https://electriummobility.com">
                        <img src="/img/logo-dark-mode.png" alt="Electrium Mobility Logo"
                             className="mx-auto mb-4 logo-opacity w-1/3 "/>
                    </a>
                    <p className="text-gray-400">Copyright © {new Date().getFullYear()} Electrium Mobility. All Rights
                        Reserved.</p>
                </div>
            </div>
        </footer>
    );
}