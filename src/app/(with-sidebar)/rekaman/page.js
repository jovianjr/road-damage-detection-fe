'use client'

import Link from 'next/link'
import clsx from 'clsx'
import {
	Calendar,
	AlignLeft,
	AlertOctagon,
	PlaySquare,
	List,
	Fullscreen,
} from 'lucide-react'

import IconComponent from '@/app/components/IconComponents'
import { useQuery } from 'react-query'
import { getAllRoad } from '@/utils/services/road'

const headerTableContent = [
	{ id: 1, icon: <Calendar />, name: 'Tanggal' },
	{ id: 2, icon: <AlignLeft />, name: 'Judul' },
	{ id: 4, icon: <AlertOctagon />, name: 'Total Kerusakan' },
	{ id: 5, icon: <PlaySquare />, name: 'Data Video' },
	{ id: 6, icon: <List />, name: 'Detail' },
]

const convertTime = (inputTimestamp) => {
	const date = new Date(inputTimestamp)
	const monthName = [
		'Januari',
		'Februari',
		'Maret',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Agustus',
		'September',
		'Oktober',
		'November',
		'Desember',
	]
	const day = date.getDate()
	const month = monthName[date.getMonth()]
	const year = date.getFullYear()

	const formattedTime = `${day} ${month} ${year}`
	return formattedTime
}

export default function DaftarRekaman() {
	const {
		isLoading: roadListIsLoading,
		isError: roadListIsError,
		data: roadList,
		isFetching: roadListIsFetching,
	} = useQuery({
		refetchOnWindowFocus: false,
		queryKey: ['all-road'],
		queryFn: () => getAllRoad({}),
	})

	return (
		<div className="justify-starts mt-4 flex min-h-screen w-full flex-col items-center bg-[#fff] text-black md:mt-16">
			<h1 className="mb-2 w-full text-left text-xl font-semibold max-md:px-4 md:mb-8 md:w-3/4 md:text-2xl">
				Daftar Rekaman
			</h1>

			{roadListIsLoading || roadListIsFetching ? (
				<>
					<table className="w-3/4 max-md:hidden">
						<thead>
							<tr>
								{headerTableContent.map((item) => {
									return (
										<td key={item.id}>
											<div className="m-2 h-[48px] animate-pulse rounded-lg bg-slate-300 p-2"></div>
										</td>
									)
								})}
							</tr>
						</thead>

						<tbody>
							{Array(10)
								.fill()
								.map((_, id) => (
									<tr key={id}>
										{headerTableContent.map((item) => (
											<td key={item.id}>
												<div className="m-2 h-[48px] animate-pulse rounded-lg bg-slate-300 p-2"></div>
											</td>
										))}
									</tr>
								))}
						</tbody>
					</table>
					<div className="mt-8 flex w-full flex-col gap-4 px-4 md:hidden">
						{Array(10)
							.fill()
							.map((_, id) => (
								<div
									key={id}
									className="m-2 h-24 animate-pulse rounded-lg bg-slate-300 p-2"
								></div>
							))}
					</div>
				</>
			) : (
				<>
					<table className="w-3/4 bg-white text-lg font-medium max-md:hidden">
						<thead>
							<tr>
								{headerTableContent.map((item) => {
									return (
										<td
											className={clsx(
												'border-b py-2 text-center md:py-4',
												item !==
													headerTableContent[headerTableContent.length - 1]
													? 'border-r'
													: ''
											)}
											key={item.id}
										>
											<div className="flex items-center justify-center gap-4">
												{item.icon}
												<p>{item.name}</p>
											</div>
										</td>
									)
								})}
							</tr>
						</thead>

						<tbody>
							{roadList?.data !== 0 ? (
								roadList?.data?.map((item, index) => (
									<tr key={index}>
										<td className="border-r py-2 text-center md:py-4">
											{convertTime(item.createdAt)}
										</td>
										<td className="border-r py-2 text-center md:py-4">
											{item.title}
										</td>
										<td className="border-r py-2 text-center md:py-4">
											{item.detectionMeta.totalDamage}
										</td>
										<td className="flex gap-2 border-r px-4 py-2 text-center md:py-4">
											{item.videoData?.map((data, index) => {
												return (
													<div
														className="rounded-lg bg-pink-300 px-2.5 py-1 text-xl"
														key={index}
													>
														{data.text}
													</div>
												)
											})}
										</td>
										<td className="px-3 py-2 text-center md:py-4">
											<div className="grid w-full grid-cols-1">
												<Link href={`/rekaman/${item._id}`}>
													<IconComponent
														icon={<Fullscreen />}
														name="Lihat Replay"
													/>
												</Link>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td className="py-2 text-center text-2xl italic md:py-4">
										Tidak ada data ditemukan
									</td>
								</tr>
							)}
						</tbody>
					</table>
					{/* card for small screen  */}
					<div className="mt-8 flex w-full flex-col gap-4 px-4 md:hidden">
						{roadList?.data !== 0 ? (
							roadList?.data?.map((item, index) => (
								<div className="flex flex-col gap-1 p-4 shadow-xl" key={index}>
									<p>{convertTime(item.createdAt)}</p>
									<p className="w-full text-lg font-semibold">{item.title}</p>
									<p>
										<span>Jumlah kerusakan: </span>
										{item.detectionMeta.totalDamage}
									</p>
									<Link href={`/rekaman/${item._id}`} className="self-end">
										<IconComponent icon={<Fullscreen />} name="Lihat Replay" />
									</Link>
								</div>
							))
						) : (
							<div className="py-2 text-center text-2xl italic md:py-4">
								Tidak ada data ditemukan
							</div>
						)}
					</div>
				</>
			)}
		</div>
	)
}
