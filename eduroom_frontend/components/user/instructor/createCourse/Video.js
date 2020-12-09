import { Fragment, useEffect } from 'react'
import CourseVideoUpload from './CourseVideoUpload'
const Video = ({ video, idx, handleVideos, sectionIndex, addVideo }) => {
	const nameChange = (e) => {
		video.name = e.target.value
		handleVideos(video, idx)
	}
	const handleUpload = (data) => {
		video.data = data
		handleVideos(video, idx)
	}
	const renderAdd = () => {
		if (idx === 0) {
			return (
				<Fragment>
					<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<i onClick={addVideo} className="fas fa-plus plus"></i>
					</div>
					<style jsx>{`
						.plus {
							opacity: 0.6;
							transition: 0.25s;
						}
						.plus:hover {
							opacity: 0.9;
							transition: 0.25s;
							cursor: pointer;
						}
					`}</style>
				</Fragment>
			)
		} else {
			return null
		}
	}
	return (
		<Fragment>
			<div className="box">
				<div>
					{renderAdd()}
					<div className="form">
						<div style={{ width: '50%' }}>
							<div className="title">Video Name</div>
							<input
								name="name"
								className="textfield"
								placeholder="Video Title"
								type="text"
								value={video.name}
								onChange={nameChange}
							></input>
						</div>
						<div style={{ width: '50%' }}>
							<div className="title">Video Upload</div>
							<CourseVideoUpload index={idx} sectionIndex={sectionIndex} handleData={handleUpload}></CourseVideoUpload>
						</div>
					</div>
				</div>
			</div>
			<style jsx>{`
				.form {
					display: flex;
				}
				.box {
					background: #ffffff;
					box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
					border-radius: 10px;
					padding: 20px 20px;
					margin-bottom: 20px;
				}
				.textfield {
					background: #eff0f6;
					border-radius: 10px;
					width: 90%;
					border: none;
					font-size: 1.1em;
					color: #3d467f;
					padding: 14px;
				}
				.textfield ::placeholder {
					color: #3d467f;
					opacity: 0.75;
				}
				.title {
					font-style: normal;
					font-weight: bold;
					font-size: 15px;
					line-height: 19px;
					letter-spacing: 0.5px;
					text-transform: uppercase;
					color: #353e6c;
					margin-bottom: 5px;
				}
			`}</style>
		</Fragment>
	)
}

export default Video
