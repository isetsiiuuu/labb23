import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import client from '../lib/Client'


const LoggedIn = () => {

	const [user, setUser] = useState([])

	useEffect(() => {
		const roleAll = async () => {
			const response = await client.get('/role');
			const data = await response.data;
			console.log('data', data.data.roles.includes('ADMIN_USER'))
			try {
				if (!data){
					Router.push('/');
				}

				if (data.data.roles.includes('NORMAL_USER')) {
					Router.push('/profile');
				}

			    if (data.data.roles.includes('ADMIN_USER')) {
					Router.push('/profile');
				}


			} catch (error) {
				console.error(error);
			}
		};
		roleAll();
	}, []);

	return <div>

	</div>
}

export default LoggedIn
