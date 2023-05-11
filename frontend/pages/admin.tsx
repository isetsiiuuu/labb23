import { useRouter } from 'next/router';
import client from '../lib/Client';
import React, { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard';

function admin() {
	return (
		<div>
			<Dashboard />
		</div>
	);
}

export default admin;
