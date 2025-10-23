import style from './loading.module.css';
const Loading = () => {
  return (
    <div className="h-screen relative w-full items-center flex flex-col gap-3 justify-center z-[101]">
      <div className={style['page-Loading']}></div>
      loading 
    </div>
  )
}

export default Loading