import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
    return (
        <header className="bg-white fixed top-0 w-full shadow-md z-50">
            <nav className="flex justify-between items-center p-4 bg-white">
                <div className="flex items-center">
                    <Image src="/img/logo-light-mode.png" alt="Electrium Mobility" width={165} height={50}/>
                </div>
                <div className="space-x-10">
                    <Link href="https://electriummobility.com/about"
                          className="font-extralight text-lg text-gray-900 hover:text-green-600 hover: transition ease-in-out duration-300">About</Link>
                    <Link href="https://electriummobility.com/team"
                          className="font-extralight text-lg text-gray-900 hover:text-green-600 hover: transition ease-in-out duration-300">Team</Link>
                    <Link href="https://electriummobility.com/docs/W2024-projects/project1_2023"
                          className="font-extralight text-lg text-gray-900 hover:text-green-600 hover: transition ease-in-out duration-300">Projects</Link>
                    <Link href="https://electriummobility.com/sponsors"
                          className="font-extralight text-lg  text-gray-900 hover:text-green-600 hover: transition ease-in-out duration-300">Sponsors</Link>
                    <Link href="" className="font-extralight text-lg text-green-600 hover:text-green-600">Shop</Link>
                    <Link href="https://electriummobility.com/contact"
                          className="font-extralight text-lg text-gray-900 hover:text-green-600 hover: transition ease-in-out duration-300">Contact</Link>
                </div>
                <div className="flex items-center space-x-4">
                    <a href="https://electriummobility.com/join-our-team">
                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-white hover:text-green-600 hover: border border-green-600 hover: transition ease-in-out duration-300">Join
                            Our Team
                        </button>
                    </a>
                    <a href="https://imodules.uwaterloo.ca/s/1802/21/form.aspx?sid=1802&gid=2&pgid=1266&cid=3030&bledit=1&dids=296">
                        <button
                            className="text-green-600 border border-green-600 px-4 py-2 rounded hover:bg-green-600 hover:text-white hover: transition ease-in-out duration-300">Donate
                        </button>
                    </a>
                        <Link href="/cart" className="text-gray-600 hover:text-gray-900">
                            <i className="fas fa-shopping-cart"></i>
                        </Link>
                        <button className="text-gray-600 hover:text-gray-900">
                            <i className="fas fa-sun"></i>
                        </button>
                </div>
            </nav>
        </header>
);
}