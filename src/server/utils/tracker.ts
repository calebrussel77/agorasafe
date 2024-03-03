import { isDev } from '@/constants';
import { getInitialState } from '@/stores/profile-store/initial-state';
import { parse } from 'date-fns';
import { type NextApiRequest, type NextApiResponse } from 'next';
import requestIp from 'request-ip';

import {
  type AddViewInput,
  type GetDaysInput,
} from '@/validations/track.validations';

import { getSubDate } from '@/lib/date-fns';
import { redis } from '@/lib/redis';

export type UserActivityType =
  | 'Registration'
  | 'Account closure'
  | 'Subscribe'
  | 'Cancel'
  | 'Donate'
  | 'Adjust Moderated Content Settings'
  | 'Banned'
  | 'Unbanned'
  | 'Muted'
  | 'Unmuted'
  | 'RemoveContent';
export type ModelVersionActivty =
  | 'Create'
  | 'Publish'
  | 'Download'
  | 'Unpublish';
export type ModelActivty =
  | 'Create'
  | 'Publish'
  | 'Update'
  | 'Unpublish'
  | 'Archive'
  | 'Takedown'
  | 'Delete'
  | 'PermanentDelete';
export type ResourceReviewType =
  | 'Create'
  | 'Delete'
  | 'Exclude'
  | 'Include'
  | 'Update';
export type ReactionType =
  | 'Images_Create'
  | 'Images_Delete'
  | 'Comment_Create'
  | 'Comment_Delete'
  | 'Review_Create'
  | 'Review_Delete'
  | 'Question_Create'
  | 'Question_Delete'
  | 'Answer_Create'
  | 'Answer_Delete'
  | 'BountyEntry_Create'
  | 'BountyEntry_Delete'
  | 'Article_Create'
  | 'Article_Delete';
export type ReportType = 'Create' | 'StatusChange';
export type ModelEngagementType = 'Hide' | 'Favorite' | 'Delete';
export type TagEngagementType = 'Hide' | 'Allow';
export type UserEngagementType = 'Follow' | 'Hide' | 'Delete';
export type CommentType =
  | 'Model'
  | 'Image'
  | 'Post'
  | 'Comment'
  | 'Review'
  | 'Bounty'
  | 'BountyEntry';
export type CommentActivity =
  | 'Create'
  | 'Delete'
  | 'Update'
  | 'Hide'
  | 'Unhide';
export type PostActivityType = 'Create' | 'Publish' | 'Tags';
export type ImageActivityType =
  | 'Create'
  | 'Delete'
  | 'DeleteTOS'
  | 'Tags'
  | 'Resources';
export type QuestionType = 'Create' | 'Delete';
export type AnswerType = 'Create' | 'Delete';
export type PartnerActivity = 'Run' | 'Update';
export type BountyActivity =
  | 'Create'
  | 'Update'
  | 'Delete'
  | 'Expire'
  | 'Refund';
export type BountyEntryActivity = 'Create' | 'Update' | 'Delete' | 'Award';
export type BountyBenefactorActivity = 'Create';

export type FileActivity = 'Download';
export type ModelFileActivity = 'Create' | 'Delete' | 'Update';

export const ActionType = [
  'AddToBounty_Click',
  'AddToBounty_Confirm',
  'AwardBounty_Click',
  'AwardBounty_Confirm',
  'Tip_Click',
  'Tip_Confirm',
  'TipInteractive_Click',
  'TipInteractive_Cancel',
  'NotEnoughFunds',
  'PurchaseFunds_Cancel',
  'PurchaseFunds_Confirm',
  'LoginRedirect',
] as const;

export type ActionType = (typeof ActionType)[number];

export type TrackRequest = {
  profileId: string;
  ip: string;
  userAgent: string;
};

type TrackOptions = {
  persist?: boolean;
};

export class Tracker {
  private _actor: TrackRequest = {
    profileId: '0',
    ip: 'unknown',
    userAgent: 'unknown',
  };
  private _retention: number = 60 * 60 * 24 * 7;

  constructor(req?: NextApiRequest, res?: NextApiResponse) {
    if (req && res) {
      this._actor.ip = requestIp.getClientIp(req) ?? this._actor.ip;
      this._actor.userAgent =
        req.headers['user-agent'] ?? this._actor.userAgent;
      const initialState = getInitialState(req.headers);
      this._actor.profileId =
        initialState?.profile?.id ?? this._actor.profileId;
    }
  }

  private async _track(
    namespace: string,
    custom: object,
    options?: TrackOptions
  ) {
    // TODO: Uncomment this after proper implementation

    try {
      // if (isDev) return;

      let key = `analytics::${namespace}`;
      const data = {
        ...this._actor,
        ...custom,
      };

      if (!options?.persist) {
        key += `::${getSubDate()}`;
      }

      await redis.hincrby(key, JSON.stringify(data), 1);

      if (!options?.persist) await redis.expire(key, this._retention);
    } catch (e) {
      console.log('TRACKING ERROR', e);
    }
  }

  private async _retrieve(
    namespace: string,
    {
      date,
      profileId,
    }: {
      date: string;
      profileId?: string;
    }
  ) {
    const res = await redis.hgetall<Record<string, string>>(
      `analytics::${namespace}::${date}`
    );
    const events = Object.entries(res ?? []);
    const totalEvents = events.map(([key, value]) => {
      const data = JSON.parse(key) as unknown;
      return {
        [key]: Number(value),
      };
    });

    if (profileId) {
      const filteredEvents = events
        .filter(([key]) => {
          const data = JSON.parse(key) as { profileId: string };
          return data.profileId === profileId;
        })
        .map(([key, value]) => {
          const data = JSON.parse(key) as unknown;
          return {
            [key]: Number(value),
          };
        });

      return {
        date,
        events: filteredEvents,
      };
    }

    return {
      date,
      events: totalEvents,
    };
  }

  public async getDays({ namespace, nDays, profileId }: GetDaysInput) {
    type AnalyticsPromise = ReturnType<typeof this._retrieve>;
    const promises: AnalyticsPromise[] = [];

    for (let i = 0; i < nDays; i++) {
      const formattedDate = getSubDate(i);
      const promise = this._retrieve(namespace, {
        date: formattedDate,
        profileId,
      });
      promises.push(promise);
    }

    const fetched = await Promise.all(promises);

    const data = fetched.sort((a, b) => {
      if (
        parse(a.date, 'dd/MM/yyyy', new Date()) >
        parse(b.date, 'dd/MM/yyyy', new Date())
      ) {
        return 1;
      } else {
        return -1;
      }
    });
    return data;
  }

  public view(
    values: {
      type: AddViewInput['type'];
      entityType: AddViewInput['entityType'];
      entityId: AddViewInput['entityId'];
    },
    options?: TrackOptions
  ) {
    return this._track('views', values, options);
  }

  public action(
    values: { type: ActionType; details?: any },
    options?: TrackOptions
  ) {
    return this._track('actions', values, options);
  }

  public activity(activity: string, options?: TrackOptions) {
    return this._track('activities', { activity }, options);
  }

  public modelEvent(values: {
    type: ModelActivty;
    modelId: number;
    nsfw: boolean;
  }) {
    return this._track('modelEvents', values);
  }

  public modelVersionEvent(values: {
    type: ModelVersionActivty;
    modelId: number;
    modelVersionId: number;
    nsfw: boolean;
    earlyAccess?: boolean;
    time?: Date;
  }) {
    return this._track('modelVersionEvents', values);
  }

  public partnerEvent(values: {
    type: PartnerActivity;
    partnerId: number;
    modelId?: number;
    modelVersionId?: number;
    nsfw?: boolean;
  }) {
    return this._track('partnerEvents', values);
  }

  public userActivity(values: {
    type: UserActivityType;
    targetUserId: number;
    source?: string;
    landingPage?: string;
  }) {
    return this._track('userActivities', values);
  }

  public resourceReview(values: {
    type: ResourceReviewType;
    modelId: number;
    modelVersionId: number;
    nsfw: boolean;
    rating: number;
  }) {
    return this._track('resourceReviews', values);
  }

  public comment(values: { type: CommentType; entityId: number }) {
    return this._track('comments', values);
  }

  public commentEvent(values: { type: CommentActivity; commentId: number }) {
    return this._track('commentEvents', values);
  }

  public post(values: {
    type: PostActivityType;
    postId: number;
    nsfw: boolean;
    tags: string[];
  }) {
    return this._track('posts', values);
  }

  public userEngagement(
    values: {
      type: UserEngagementType;
      targetUserId: number;
    },
    options?: TrackOptions
  ) {
    return this._track('userEngagements', values, options);
  }

  public share(
    values: {
      url: string;
      platform: 'linkedIn' | 'twitter' | 'whatsapp' | 'clipboard';
    },
    options?: TrackOptions
  ) {
    return this._track('shares', values, options);
  }

  public file(
    values: {
      type: FileActivity;
      entityType: string;
      entityId: number;
    },
    options?: TrackOptions
  ) {
    return this._track('files', values, options);
  }

  public search(
    values: { query: string; index: string; filters?: any },
    options?: TrackOptions
  ) {
    return this._track('search', values, options);
  }
}
