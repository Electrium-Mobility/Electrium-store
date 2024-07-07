import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold mb-4">Pages</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about">About</Link></li>
                            <li><Link href="/team">Team</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Recent Projects</h3>
                        <ul className="space-y-2">
                            <li><Link href="/projects/electric-bike">Electric Bike</Link></li>
                            <li><Link href="/projects/electric-skateboard">Electric Skateboard</Link></li>
                            <li><Link href="/projects/onewheel">OneWheel</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Get Involved</h3>
                        <ul className="space-y-2">
                            <li><Link href="/join">Join Our Team</Link></li>
                            <li><Link href="/sponsor">Become A Sponsor</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Community</h3>
                        <ul className="space-y-2">
                            <li><Link href="/support">Support Us</Link></li>
                            <li><a href="https://www.youtube.com">YouTube</a></li>
                            <li><a href="https://www.instagram.com">Instagram</a></li>
                            <li><a href="https://www.discord.com">Discord</a></li>
                            <li><a href="https://www.linkedin.com">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}