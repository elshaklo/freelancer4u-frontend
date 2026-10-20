<script>
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  let companies = $derived(data.companies);
</script>

<h1 class="mt-3">Create Company</h1>

{#if form?.success}
  <div class="alert alert-success" role="alert">Company created successfully!</div>
{/if}

{#if form?.error}
  <div class="alert alert-danger" role="alert">{form.error}</div>
{/if}

<form class="mb-5" method="POST" action="?/createCompany" use:enhance>
  <div class="row mb-3">
    <div class="col">
      <label class="form-label" for="name">Company name</label>
      <input class="form-control" id="name" name="name" type="text" value={form?.name ?? ''} required />
    </div>
    <div class="col">
      <label class="form-label" for="email">Email</label>
      <input class="form-control" id="email" name="email" type="email" value={form?.email ?? ''} required />
    </div>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>

<h1>All Companies</h1>
<div class="table-responsive">
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">CompanyId</th>
      </tr>
    </thead>
    <tbody>
      {#each companies as company (company.id)}
        <tr>
          <td>{company.name}</td>
          <td>{company.email}</td>
          <td>{company.id}</td>
        </tr>
      {:else}
        <tr><td colspan="3">No companies yet. Create your first company above.</td></tr>
      {/each}
    </tbody>
  </table>
</div>
