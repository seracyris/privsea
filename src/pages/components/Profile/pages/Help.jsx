import React from 'react';
import downloadImage from '../../../assets/openvpn_download.png';
import uploadImage from '../../../assets/openvpn_upload.png';

const Help = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-neutral-100 p-6">
            <h1 className="text-3xl font-bold mb-4">VPN Client Help</h1>

            <section className="mb-6 bg-slate-700 p-4 rounded-lg flex">
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2">Installing the OpenVPN Client</h2>
                    <p className="mb-2">
                        Follow these steps to install the OpenVPN client on your device:
                    </p>
                    <ol className="list-decimal list-inside mb-4">
                        <li>
                            <span>Go to the official OpenVPN download page: </span>
                            <a href="https://openvpn.net/community-downloads/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                                OpenVPN Community Downloads
                            </a>
                        </li>
                        <li>Download the installer for your operating system (Windows, macOS, or Linux).</li>
                        <li>Run the installer and follow the on-screen instructions to complete the installation.</li>
                    </ol>
                </div>
                <img src={downloadImage} alt="OpenVPN Download Page" className="w-1/3 h-auto rounded-lg ml-4" />
            </section>

            <section className="mb-6 bg-slate-700 p-4 rounded-lg flex">
                <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2">Setting Up Your VPN Configuration</h2>
                    <p className="mb-2">
                        After installing the OpenVPN client, you need to set up your VPN configuration file:
                    </p>
                    <ol className="list-decimal list-inside mb-4">
                        <li>
                            Download your VPN configuration file (.ovpn) from your Services or Dashboard tab. This file contains the necessary settings to connect to the VPN server.
                        </li>
                        <li>
                            Open the OpenVPN client and click on the <strong>"Upload"</strong> button.
                        </li>
                        <li>
                            Browse to the location where you saved your .ovpn file and select it.
                        </li>
                        <li>
                            Click on the <strong>"Connect"</strong> button to establish the VPN connection.
                        </li>
                    </ol>
                </div>
                <img src={uploadImage} alt="OpenVPN Upload Configuration" className="w-1/6 h-auto rounded-lg ml-4" />
            </section>

            <section className="mb-6 bg-slate-700 p-4 rounded-lg">
                <h2 className="text-2xl font-semibold mb-2">Troubleshooting</h2>
                <p className="mb-2">
                    If you encounter any issues, try the following troubleshooting steps:
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li>Ensure that your internet connection is stable.</li>
                    <li>Check that you have entered the correct username and password, if required.</li>
                    <li>Verify that the .ovpn file is correctly configured and not corrupted.</li>
                    <li>Restart your device and try connecting again.</li>
                    <li>
                        <span>Consult the OpenVPN documentation for additional help: </span>
                        <a href="https://openvpn.net/community-resources/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                            OpenVPN Community Resources
                        </a>
                    </li>
                    <li>
                        <span>You can also contact our support team on our discord server: </span>
                        <a href="https://discord.gg/4fHjd22qvv" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                            Privsea discord
                        </a>
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default Help;
