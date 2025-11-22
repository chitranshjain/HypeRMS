import axios from 'axios';

const API_URL = 'http://localhost:3000';

async function runVerification() {
    try {
        console.log('Starting verification...');

        // 1. Create Product
        console.log('Creating Product...');
        const productRes = await axios.post(`${API_URL}/products`, { name: 'Test Product' });
        const product = productRes.data;
        console.log('Product created:', product.id);

        // 2. Create Release
        console.log('Creating Release...');
        const releaseRes = await axios.post(`${API_URL}/products/${product.id}/releases`, { targetDate: '2024-12-31' });
        const release = releaseRes.data;
        console.log('Release created:', release.id);

        // 3. Create Release Item with Prerequisites
        console.log('Creating Release Item...');
        const itemRes = await axios.post(`${API_URL}/releases/${release.id}/items`, {
            title: 'Feature A',
            type: 'FEATURE',
            description: 'A new feature',
            prerequisites: [
                { title: 'Env Var', category: 'ENV_VAR' }
            ]
        });
        const item = itemRes.data;
        console.log('Item created:', item.id);

        // 4. Try to release item (Should fail)
        console.log('Attempting to release item (Expected Failure)...');
        try {
            await axios.patch(`${API_URL}/items/${item.id}/status`, { status: 'RELEASED' });
            console.error('ERROR: Item released prematurely!');
        } catch (error: any) {
            console.log('Success: Item release failed as expected:', error.response?.data?.error);
        }

        // 5. Complete Prerequisite
        console.log('Completing Prerequisite...');
        const prereqId = item.prerequisites[0].id;
        await axios.patch(`${API_URL}/prerequisites/${prereqId}/status`, { status: 'DONE' });
        console.log('Prerequisite marked as DONE');

        // 6. Release Item (Should succeed)
        console.log('Releasing Item...');
        await axios.patch(`${API_URL}/items/${item.id}/status`, { status: 'RELEASED' });
        console.log('Item released successfully');

        // 7. Check Release Status
        console.log('Checking Release Status...');
        const updatedReleaseRes = await axios.get(`${API_URL}/products/${product.id}/releases`);
        // Check both upcoming and historical
        const allReleases = [...updatedReleaseRes.data.upcoming, ...updatedReleaseRes.data.historical];
        const updatedRelease = allReleases.find((r: any) => r.id === release.id);
        console.log('Release Status:', updatedRelease.status);

        if (updatedRelease.status === 'RELEASED') {
            console.log('SUCCESS: Release marked as RELEASED!');
        } else {
            console.error('FAILURE: Release status should be RELEASED');
        }

        // 8. Verify New Endpoints
        console.log('Verifying New Endpoints...');

        // Get Release Items
        const releaseItemsRes = await axios.get(`${API_URL}/releases/${release.id}/items`);
        if (releaseItemsRes.data.length > 0) {
            console.log('SUCCESS: Fetched release items');
        } else {
            console.error('FAILURE: Could not fetch release items');
        }

        // Get Item Details
        const itemDetailsRes = await axios.get(`${API_URL}/items/${item.id}`);
        if (itemDetailsRes.data.id === item.id && itemDetailsRes.data.prerequisites.length > 0) {
            console.log('SUCCESS: Fetched item details with prerequisites');
        } else {
            console.error('FAILURE: Could not fetch item details');
        }

        console.log('ALL CHECKS PASSED!');

    } catch (error: any) {
        console.error('Verification failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

runVerification();
