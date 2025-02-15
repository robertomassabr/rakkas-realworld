import { ActionButton } from "lib/ActionButton";
import { Article } from "lib/api-types";
import { ConduitContext } from "lib/ConduitContext";
import { favorite, unfavorite } from "lib/conduit-client";
import { Link } from "rakkasjs";
import React, { CSSProperties, FC, useContext } from "react";

export interface FavoriteButtonProps {
	article: Article;
	onComplete?(): void;
	minimal?: boolean;
	style?: CSSProperties;
}

export const FavoriteButton: FC<FavoriteButtonProps> = ({
	article,
	minimal,
	style,
	onComplete,
}) => {
	const ctx = useContext(ConduitContext);
	const { user } = ctx;

	return user ? (
		<ActionButton
			key={`${user.token}:${article.slug}:${article.favorited}`}
			style={style}
			action={
				"/api/form/article/" +
				encodeURIComponent(article.slug) +
				(article.favorited ? "/unfavorite" : "/favorite")
			}
			title="Favorite article"
			label={
				<>
					{minimal || (
						<>
							{article.favorited ? (
								<>Unfavorite Article </>
							) : (
								<>Favorite Article </>
							)}{" "}
						</>
					)}
					<span className="counter">
						{minimal || "("}
						{article.favoritesCount}
						{minimal || ")"}
					</span>
				</>
			}
			inProgressLabel={
				<>
					{minimal || (
						<>
							{article.favorited ? (
								<>Unfavorite Article </>
							) : (
								<>Favorite Article </>
							)}{" "}
						</>
					)}
					<span className="counter">({article.favoritesCount - 1})</span>
				</>
			}
			icon="heart"
			type="primary"
			size="small"
			outline={!article.favorited}
			onClick={async () => {
				await (article.favorited
					? unfavorite(ctx, article.slug)
					: favorite(ctx, article.slug));
				onComplete?.();
			}}
		/>
	) : (
		<Link href="/register" className="btn btn-sm btn-outline-secondary">
			<i className="ion-heart"></i>
			&nbsp; Favorite Article{" "}
			<span className="counter">({article.favoritesCount})</span>
		</Link>
	);
};
