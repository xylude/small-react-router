import React, {
	useState,
	useCallback,
	useContext,
	createContext,
	useEffect
} from "react";
import "./App.css";

const LocationContext = createContext( undefined );
const LocationRouterContext = createContext( [] );

export function Router ( { children } ) {
	const [ path, setPath ] = useState( [] );

	const handleHashChange = useCallback( () => {
		const win_path = window.location.href.split( "#/" );
		if ( win_path.length > 1 ) {
			setPath( win_path[ 1 ].split( "/" ) );
		}
	} );

	useEffect( () => {
		handleHashChange();

		window.addEventListener( "hashchange", handleHashChange, false );

		return () => {
			window.removeEventListener( "hashchange", handleHashChange, false );
		};
	}, [ handleHashChange ] );

	return (
		<LocationRouterContext.Provider value={ path }>
			{ children }
		</LocationRouterContext.Provider>
	);
}

export function Location ( { children, path } ) {
	const sub_locations = useContext( LocationRouterContext );

	return (
		<LocationContext.Consumer>
			{ ( sub_location_path = sub_locations ) => {
				const [ current_path, ...rest_path ] = sub_location_path;

				return current_path === path ? (
					<LocationContext.Provider value={ rest_path }>
						{ children }
					</LocationContext.Provider>
				) : null;
			} }
		</LocationContext.Consumer>
	);
}

export function Link ( { children, href } ) {
	return <a href={ `#${ href }` }>{ children }</a>;
}

