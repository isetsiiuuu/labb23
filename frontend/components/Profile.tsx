import { useRouter } from 'next/router';
import {
	useState,
	useEffect,
	JSXElementConstructor,
	Key,
	ReactElement,
	ReactFragment,
	ReactPortal,
} from 'react';
import client from '../lib/Client';

const Profil = () => {
	const [loggedIn, setLoggedIn] = useState<any>([]);
	const router = useRouter();

	useEffect(() => {
		const roleAll = async () => {
			const response = await client.get('/role');
			const data = await response.data;
			console.log("data",data)
			try {

				
				if (data.data.roles.includes('ADMIN_USER')) {
					router.push('/admin');
				}

				if (response.status == 200) {
					setLoggedIn([data.data]);
					console.log('Fetchad data |', data);
				}
			} catch (error) {
				console.error(error);
			}
		};
		roleAll();
	}, [router]);

	const logout = async () => {
		const response = await client.get('logout');
		const data = await response.data;
		console.log(data);
		router.push('/');
	};

	const profilInfo = loggedIn?.map(
		(
			user1: {
				[x: string]:
					| string
					| number
					| boolean
					| ReactElement<any, string | JSXElementConstructor<''>>
					| ReactFragment
					| ReactPortal
					| null
					| undefined;
			},
			index: Key | null | undefined
		) => {
			return (
				<>
					<div className="wrapperText">
						<h1> Welcome {user1['iss']} !</h1>
						
						</div>
						<div className='table'>
							<table >
								
									<tr>
										<th>
											<p>UserId</p>
										</th>
										<th>
											<p>name</p>
										</th>
										<th>
											<p>Email</p>
										</th>
										<th>
											<p>Roll</p>
										</th>
									</tr>
									<tr key={index}>
										<td>{user1['id']}</td>
										<td>{user1['iss']}</td>
										<td>{user1['email']}</td>
										<td>{user1['roles']}</td>
									</tr>
								
							</table>
							<div className="wrapperText">
							
								
							</div>
							<br></br>
							<button className="formBtn" onClick={logout}>
								Logout
							</button>
						</div>
				
				</>
			);
		}
	);

	return <div>{profilInfo}</div>;
};

export default Profil;
