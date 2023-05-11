import { useRouter } from 'next/router';
import {
	useState,
	useEffect,
	ReactElement,
	JSXElementConstructor,
	ReactFragment,
	Key,
	ReactPortal,
} from 'react';
import client from '../lib/Client';
import AdminProfil from './AdminPl';

const Dashboard = () => {
	const [users, setUsers] = useState([]);
	const [loggedIn, setLoggedIn] = useState<any>([]);

	const router = useRouter();

	useEffect(() => {
		const roleAll = async () => {
			const response = await client.get('/role');
			const data = await response.data;
			try {
				if (data.data.roles.includes('NORMAL_USER')) {
					router.push('/profil');
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
					
					console.log('database!', users);
					
				}
			} catch (error) {}
		};
		fetchUsers();
	}, []);

	const listUsers = users?.map((user) => {
		return (
			<tr key={user['userId']}>
				<td>{user['userId']}</td>
				<td>{user['username']}</td>
				<td>{user['email']}</td>
			</tr>
		);
	});

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
					| string | number | boolean | ReactElement<any, string | JSXElementConstructor<''>> | ReactFragment | ReactPortal | null | undefined;
			},
			index: Key | null | undefined
		) => {
			return (
				<>
					<div className="wrapperText">
				
						<h1> Hello {user1['iss']}  !</h1>
						
						</div>
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
							<button className="formBtn" onClick={logout}>
								Logout
							</button>
						</div>
					
				</>
			);
		}
	);

	return (
		<div>
			{profilInfo}
			<div className="wrapper">
				<h1>List of your users!</h1>

				<div>
					<table>
						<tbody>
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
							</tr>
							{listUsers}
						</tbody>
					</table>
					<br></br>
					<br></br>
					<button className="buttonAd" onClick={logout}>
						Logout
					</button>
				</div>
					
			</div>
		
		</div>
	);
};

export default Dashboard;
