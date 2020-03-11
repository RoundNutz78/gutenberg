/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import HeadingToolbar from './heading-toolbar';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { PanelBody, __experimentalText as Text } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import {
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	RichText,
	__experimentalUseColors,
	__experimentalBlock as Block,
} from '@wordpress/block-editor';
import { useRef, Platform } from '@wordpress/element';

function HeadingEdit( { attributes, setAttributes, mergeBlocks, onReplace } ) {
	const ref = useRef();
	const { TextColor, InspectorControlsColorPanel } = __experimentalUseColors(
		[ { name: 'textColor', property: 'color' } ],
		{
			contrastCheckers: { backgroundColor: true, textColor: true },
			colorDetector: { targetRef: ref },
		},
		[]
	);

	const { align, content, level, placeholder } = attributes;
	const tagName = 'h' + level;

	return (
		<>
			<BlockControls>
				<HeadingToolbar
					minLevel={ 2 }
					maxLevel={ 5 }
					selectedLevel={ level }
					onChange={ ( newLevel ) =>
						setAttributes( { level: newLevel } )
					}
					isCollapsed={ Platform.OS === 'web' }
				/>
				<AlignmentToolbar
					value={ align }
					onChange={ ( nextAlign ) => {
						setAttributes( { align: nextAlign } );
					} }
					isCollapsed={ Platform.OS === 'web' }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={ __( 'Heading settings' ) }>
					<Text variant="label">{ __( 'Level' ) }</Text>
					<HeadingToolbar
						isCollapsed={ false }
						minLevel={ 1 }
						maxLevel={ 7 }
						selectedLevel={ level }
						onChange={ ( newLevel ) =>
							setAttributes( { level: newLevel } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			{ InspectorControlsColorPanel }
			<TextColor>
				<RichText
					ref={ ref }
					identifier="content"
					tagName={ Block[ tagName ] }
					value={ content }
					onChange={ ( value ) =>
						setAttributes( { content: value } )
					}
					onMerge={ mergeBlocks }
					onSplit={ ( value ) => {
						if ( ! value ) {
							return createBlock( 'core/paragraph' );
						}

						return createBlock( 'core/heading', {
							...attributes,
							content: value,
						} );
					} }
					onReplace={ onReplace }
					onRemove={ () => onReplace( [] ) }
					className={ classnames( {
						[ `has-text-align-${ align }` ]: align,
					} ) }
					placeholder={ placeholder || __( 'Write heading…' ) }
					textAlign={ align }
				/>
			</TextColor>
		</>
	);
}

export default HeadingEdit;
