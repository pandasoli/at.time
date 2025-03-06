<header class='z-50 bg-white/90 sticky top-0 px-6 md:px-8 lg:px-12 py-3 sm:py-6 shadow-sm'>
	<input type='checkbox' id='menuToggle' class='hidden' />

	<nav class='grid grid-cols-1 justify-between items-center lg:flex lg:flex-row lg:gap-6 xl:gap-12 xl:text-lg'>
		<div class='flex flex-auto items-center justify-between lg:justify-start select-none w-full lg:w-auto gap-3 md:gap-6 lg:gap-8'>
			<a class='font-bold text-3xl' href='/'>at.time</a>

			<label for='menuToggle' class='flex flex-col justify-center gap-[4px] w-[24px] cursor-pointer lg:hidden touch-manipulation'>
				<div></div>
				<div></div>
				<div></div>
			</label>
		</div>

		<div class='hidden flex-col w-full mt-5 gap-x-4 gap-y-4 lg:flex lg:flex-row lg:items-center lg:mx-0 lg:mt-0'>
			<ul class='flex flex-col leading-loose divide-incl-y lg:flex-row lg:gap-x-4 lg:select-none lg:divide-incl-y-0'>
				{#each ['Posts', 'Paper'] as item}
					<li class='border-t lg:border-t-0 border-gray-200'>
						<a class='normal block px-1 my-3 lg:m-0 lg:px-2 lg:rounded-md lg:hover:bg-slate-300' href='/'>{item}</a>
					</li>
				{/each}
			</ul>

			<div class='flex flex-col lg:flex-row grow gap-4 lg:items-center lg:justify-end'>
				<input type='text' placeholder='Search...' />
			</div>
		</div>
	</nav>
</header>

<style>
	label div {
		width: 100%;
		height: 1px;
		background: var(--color-gray-700);
		transition: transform .3s, opacity .3s
	}

	#menuToggle:checked ~ nav > div:nth-child(2) { display: flex }

	label div:last-child { width: 50% }

	#menuToggle:checked ~ nav label div:nth-child(1) { transform: rotate(135deg) translate(4px, -4px) }
	#menuToggle:checked ~ nav label div:nth-child(2) { transform: rotate(45deg) }
	#menuToggle:checked ~ nav label div:nth-child(3) { transform: rotate(-45deg) translate(1px, 4px); opacity: 0 }
</style>
