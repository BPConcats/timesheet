<script>

    export let onToggle = () => {};
    export let isToggled = false;

    let toggled = isToggled;
</script>

<div on:click={() => {
    console.log("TEST");
    toggled = !toggled;
    onToggle(toggled);
}} style="{toggled ? "background-color: var(--green);" : ""}">
    <div class="pill-ball" style="{toggled ? "right: 2px; background-color: white;" : "left: 2px;"}"></div>
</div>

<style>
    div {
        cursor: pointer;
        position: relative;
        border: 1px solid var(--border);
        width: 50px;
        height: 30px;
        border-radius: 999px;
        background-color: var(--bg);

        transition: all 50ms ease-in-out;
    }

    .pill-ball {
        height: 24px;
        width: 24px;
        position: absolute;
        top: 2px;
        background-color: var(--grey);
    }
</style>
