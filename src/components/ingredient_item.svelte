<script>
    export let itemLabel;
	export let highlighted;
</script>

<style>
li.autocomplete-items {
  list-style: none;
  border-bottom: 1px solid #d4d4d4;
  z-index: 99 !important;
  top: 100%;
  left: 0;
  right: 0;
  padding: 10px;
  cursor: pointer;
  background-color: #fff;
}

</style>

<li class="autocomplete-items w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600 hover:text-blue-800 active:text-blue-800" class:autocomplete-active={highlighted} on:click>{@html itemLabel}</li>