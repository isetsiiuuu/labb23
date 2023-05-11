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

const AdminProfile = () => {
	const [loggedIn, setLoggedIn] = useState<any>([]);
	const [users, setUsers] = useState([]);

	const router = useRouter();

	useEffect(() => {
		const roleAll = async () => {
			const response = await client.get('/role');
			const data = await response.data;

			try {
				if (data.data.roles.includes('NORMAL')) {
					router.push('/profile');
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

	useEffect(() => {
		const fetchUsers = async () => {
			const res = await client.get('users');

			try {
				if (res.status == 200) {
					const users = await res.data;
					setUsers(users);
					
					console.log('databasen!', users);
					
				}
			} catch (error) {}
		};
		fetchUsers();
	}, []);

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
						<span>
							<h1> Hello {user1['iss']} You are Admin !</h1>
						</span>
						
						<button className="buttonAd" onClick={logout}>
							Logout
						</button>
						<div>
							<table>
							
									<tr>
										<th>
											<p>UserId</p>
										</th>
										<th>
											<p>Name</p>
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

							<br></br>
						</div>
					</div>
				</>
			);
		}
	);

	return <div>{profilInfo}</div>;
};

export default AdminProfile;
