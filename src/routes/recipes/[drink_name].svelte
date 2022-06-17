<script context="module">
  /** @type {import('./__types/[drink_name]').Load} */
  export  async function load({ params, fetch, session, stuff }) {
    console.log(params.drink_name)
    return {
            props: {
                drink_name: params.drink_name
            }
        };
}

</script>
<script>
    export let drink_name;
</script>
<h1>{drink_name}</h1>