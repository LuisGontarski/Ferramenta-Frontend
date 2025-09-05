import React from "react";
import "./MenuLateral.css";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuChartColumn, LuCalendar } from "react-icons/lu";
import { IoMdCheckboxOutline } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { TbLogout2 } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import { TfiRulerAlt2 } from "react-icons/tfi";

const MenuLateral = () => {
	return (
		<div className="menu_lateral">
			<div className="container_menu_lateral_nav">
				<NavLink 
					to="/" 
					className={({ isActive }) => isActive ? "menu_lateral_item selecionado" : "menu_lateral_item"}
				>
					<MdOutlineDashboard size={'16px'} /> <span>Dashboard</span>
				</NavLink>

				<NavLink to="/projetos" className={({ isActive }) => isActive ? "menu_lateral_item selecionado" : "menu_lateral_item"}>
					<AiOutlineFolderOpen size={'16px'} /> <span>Projetos</span>
				</NavLink>
			</div>

			<div className="footer_menu_lateral">
				<NavLink to="/perfil" className={({ isActive }) => isActive ? "menu_lateral_item selecionado" : "menu_lateral_item"}>
					<BiUser size={'16px'}/> <span>Perfil</span>
				</NavLink>

				<NavLink to="/login" className="menu_lateral_item">
					<TbLogout2 size={'16px'} /> <span>Sair</span>
				</NavLink>
			</div>
		</div>
	);
};

export default MenuLateral;
