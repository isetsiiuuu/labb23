import Link from 'next/link';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import client from '../lib/Client';
import * as data from './links.json';
const linksString = JSON.stringify(data);
const links = JSON.parse(linksString).links;

type Link = {
    label: string;
    href: string;
};

const Links: React.FC<{ links: Link[] }> = ({ links }) => {
    return (
        <div className='links-container'>
            {links.map((link: Link) => {
                return (
                    <div key={link.href} className='link'>
                        <a href={link.href}>
                            {link.label}
                        </a>
                    </div>
                )
            })}
        </div>
    )
};

const Nav: React.FC<{}> = () => {
    return (
        <nav className='navbar'>
            <div className='logo-container'>
            <div className="color-circle-shadow">
                <span className='cir'>Game</span>
                </div>
            </div>
            <Links links={links} />
        </nav>
    )
}

export default Nav;