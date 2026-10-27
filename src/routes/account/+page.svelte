<script>
 let { data } = $props();
 let user = $derived(data.user);
</script>
<h1>Account Details</h1>
{#if user.picture}<p><img src={user.picture} alt="Profile" width="96" /></p>{/if}
<p><b>Name:</b> {user.name ?? ''}</p>
<p><b>Nickname:</b> {user.nickname ?? ''}</p>
<p><b>First Name:</b> {user.given_name ?? ''}</p>
<p><b>Last Name:</b> {user.family_name ?? ''}</p>
<p><b>Email:</b> {user.email ?? ''}</p>
{#if user.user_roles?.length}<p><b>Roles:</b> {user.user_roles.join(', ')}</p>{/if}
