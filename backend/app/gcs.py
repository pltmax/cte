"""
Google Cloud Storage utility for generating signed URLs.

Required env vars:
  GCS_BUCKET_NAME              — name of the GCS bucket
  GCS_SERVICE_ACCOUNT_JSON     — full service-account JSON as a string
                                 (needed for signing; ADC user-creds cannot sign)

To create a service account key:
  gcloud iam service-accounts create toeic-reader \\
    --description="Read TOEIC assets from GCS"
  gcloud storage buckets add-iam-policy-binding gs://$BUCKET \\
    --member=serviceAccount:toeic-reader@$PROJECT.iam.gserviceaccount.com \\
    --role=roles/storage.objectViewer
  gcloud iam service-accounts keys create sa-key.json \\
    --iam-account=toeic-reader@$PROJECT.iam.gserviceaccount.com
  # Then: GCS_SERVICE_ACCOUNT_JSON=$(cat sa-key.json)
"""

import json
import os
from datetime import timedelta
from functools import lru_cache

from fastapi import HTTPException
from google.cloud import storage  # type: ignore[import]


@lru_cache(maxsize=1)
def _get_client() -> storage.Client:
    sa_json = os.environ.get("GCS_SERVICE_ACCOUNT_JSON")
    if not sa_json:
        raise HTTPException(
            status_code=503,
            detail=(
                "GCS_SERVICE_ACCOUNT_JSON is not configured. "
                "A service-account key is required to generate signed URLs."
            ),
        )
    from google.oauth2 import service_account  # type: ignore[import]

    info = json.loads(sa_json)
    creds = service_account.Credentials.from_service_account_info(
        info,
        scopes=["https://www.googleapis.com/auth/devstorage.read_only"],
    )
    return storage.Client(credentials=creds)


def _bucket_name() -> str:
    name = os.environ.get("GCS_BUCKET_NAME", "")
    if not name:
        raise HTTPException(
            status_code=503,
            detail="GCS_BUCKET_NAME is not configured.",
        )
    return name


def sign_url(blob_path: str, ttl_hours: int = 1) -> str:
    """Return a V4 signed URL for *blob_path* that expires in *ttl_hours* hours."""
    client = _get_client()
    blob = client.bucket(_bucket_name()).blob(blob_path)
    return blob.generate_signed_url(
        expiration=timedelta(hours=ttl_hours),
        method="GET",
        version="v4",
    )


def blob_path_from_url(public_url: str) -> str:
    """
    Strip 'https://storage.googleapis.com/{bucket}/' from a public GCS URL
    to get the raw blob path that can be signed.
    """
    bucket = _bucket_name()
    prefix = f"https://storage.googleapis.com/{bucket}/"
    if not public_url.startswith(prefix):
        raise HTTPException(
            status_code=503,
            detail=(
                f"Stored URL does not belong to bucket {bucket!r}. "
                "Re-run the upload script after setting GCS_BUCKET_NAME."
            ),
        )
    return public_url[len(prefix):]
